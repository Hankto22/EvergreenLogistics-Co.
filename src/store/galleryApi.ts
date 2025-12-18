import { api } from "./api";

export const galleryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGallery: builder.query({
      query: (category?: string) => ({
        url: "gallery",
        params: category ? { category } : undefined
      }),
      providesTags: ["Gallery"]
    }),

    createGalleryItem: builder.mutation({
      query: (payload) => ({
        url: "gallery",
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["Gallery"]
    }),

    deleteGalleryItem: builder.mutation({
      query: (id: string) => ({
        url: `gallery/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Gallery"]
    })
  })
});

export const {
  useGetGalleryQuery,
  useCreateGalleryItemMutation,
  useDeleteGalleryItemMutation
} = galleryApi;