import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase";

export type Document = Tables<"documents">;
export type Person = Tables<"people">;

export const documentService = {
  async getDocuments() {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getDocumentsByType(type: string) {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("type", type)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getDocumentById(id: string) {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async getPeopleByDocumentId(documentId: string) {
    const { data, error } = await supabase
      .from("people")
      .select("*")
      .eq("document_id", documentId);

    if (error) throw error;
    return data;
  },

  async createDocument(
    document: Omit<
      Tables<"documents">["Insert"],
      "id" | "created_at" | "updated_at"
    >,
    people: Omit<Tables<"people">["Insert"], "id" | "document_id">[],
  ) {
    // Start a transaction
    const { data: documentData, error: documentError } = await supabase
      .from("documents")
      .insert(document)
      .select()
      .single();

    if (documentError) throw documentError;

    // Add people associated with the document
    if (people.length > 0) {
      const peopleWithDocumentId = people.map((person) => {
        return {
          ...person,
          document_id: documentData.id,
        };
      });

      const { error: peopleError } = await supabase
        .from("people")
        .insert(peopleWithDocumentId);

      if (peopleError) throw peopleError;
    }

    return documentData;
  },

  async updateDocument(
    id: string,
    document: Partial<Tables<"documents">["Update"]>,
    people?: Omit<Tables<"people">["Insert"], "id" | "document_id">[],
  ) {
    // Update document
    const { data: documentData, error: documentError } = await supabase
      .from("documents")
      .update(document)
      .eq("id", id)
      .select()
      .single();

    if (documentError) throw documentError;

    // If people data is provided, delete existing people and add new ones
    if (people) {
      // Delete existing people
      const { error: deleteError } = await supabase
        .from("people")
        .delete()
        .eq("document_id", id);

      if (deleteError) throw deleteError;

      // Add new people
      if (people.length > 0) {
        const peopleWithDocumentId = people.map((person) => {
          return {
            ...person,
            document_id: id,
          };
        });

        const { error: peopleError } = await supabase
          .from("people")
          .insert(peopleWithDocumentId);

        if (peopleError) throw peopleError;
      }
    }

    return documentData;
  },

  async deleteDocument(id: string) {
    // Delete associated people first (due to foreign key constraint)
    const { error: peopleError } = await supabase
      .from("people")
      .delete()
      .eq("document_id", id);

    if (peopleError) throw peopleError;

    // Delete the document
    const { error: documentError } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    if (documentError) throw documentError;

    return true;
  },

  async searchDocuments(filters: any) {
    let query = supabase.from("documents").select("*");

    // Apply filters
    if (filters.query) {
      // Search in document number or in associated people's names
      query = query.or(
        `number.ilike.%${filters.query}%,id.in.(${supabase
          .from("people")
          .select("document_id")
          .or(`name.ilike.%${filters.query}%,surname.ilike.%${filters.query}%`)
          .then(({ data }) => data?.map((p) => p.document_id) || [])})`,
      );
    }

    if (filters.documentType && filters.documentType !== "all") {
      query = query.eq("type", filters.documentType);
    }

    if (filters.parish) {
      query = query.ilike("church", `%${filters.parish}%`);
    }

    if (filters.book) {
      query = query.eq("book", filters.book);
    }

    if (filters.page) {
      query = query.eq("page", filters.page);
    }

    if (filters.dateRange?.from && filters.dateRange?.to) {
      query = query
        .gte("date", filters.dateRange.from.toISOString().split("T")[0])
        .lte("date", filters.dateRange.to.toISOString().split("T")[0]);
    }

    if (!filters.includeArchived) {
      query = query.eq("status", "active");
    }

    // Execute query
    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;
    return data;
  },
};
