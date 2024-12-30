import {
  // useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "./queryKeys";
import {
  createPost,
  deleteSavedPost,
  getPostById,
  getPostsForUser,
  getRecentPosts,
  // getSavesForUser,
  likePost,
  savePost,
  // followUser,
  // unfollowUser,
} from "../actions/post.actions";
import {
  getUserById,
  // deleteAccount,
  // // getLoggedInUser,
  // getUserById,
  
  logoutAccount,
  signIn,
  signUp,
} from "../actions/user.actions";
import {
  updateUserAvatar,
  // updatePost,
  updateUserProfile,
  // updateUserMoreProfile,
} from "../actions/update.actions";

export const useSignUp = () => {
  return useMutation({
    mutationFn: (user: SignUpParams) => signUp(user),
  });
};

// export const useDeleteAccount = () => {
//   return useMutation({
//     mutationFn: (userId: string) => deleteAccount(userId),
//   });
// };
export const useSignIn = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) => signIn(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: logoutAccount,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: async () => {
      const data = await getRecentPosts();

      return data;
    },
  });
};

// export const useGetRecentSaves = (userId: User["$id"]) => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_RECENT_SAVES, userId], // Adjusted query key for uniqueness
//     queryFn: async () => {
//       const data = await getSavesForUser(userId);
//       return data;
//     },
//     enabled: !!userId, // Ensures the query only runs if userId is available
//   });
// };

export const useGetUserPosts = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS], // Unique query key for caching
    queryFn: async () => {
      const data = await getPostsForUser(userId);

      return data;
    },
  });
};
// export const useUpdateProfileImage = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ user, file }: Help) => {
//       const data = await updateUserAvatar({ user, file });
//       return data;
//     },
//     onSuccess: (data) => {
//       if (data?.$id) {
//         queryClient.invalidateQueries({
//           queryKey: ["GET_PROFILE", data.user.$id],
//         });
//       }
//     },
//   });
// };
export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};
// import them
export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      savePost(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      //queryKey it
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};
export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};
// export const useUpdatePost = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (post: IUpdatePost) => updatePost(post),
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
//       });
//     },
//   });
// };
// export const useDeletePost = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) =>
//       deletePost(postId, imageId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//       });
//     },
//   });
// };

// export const useGetCurrentUser = () => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//     queryFn: async () => {
//       const data = await getLoggedInUser();
//       return data;
//     },
//   });
// };
// export const useGetUserSavess = (userId: string) => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_RECENT_SAVES, userId], // Include userId for uniqueness
//     queryFn: async () => {
//       const data = await getSavesForUser(userId);
//       console.log("Data from getSavesForUser:", data); // Debug log
//       return data;
//     },
//     // staleTime: 5 * 60 * 1000, // Optional: Set stale time for caching
//     // cacheTime: 10 * 60 * 1000, // Optional: Set cache time
//     // refetchOnWindowFocus: false, // Optional: Prevent refetching on window focus
//   });
// };
// export const useUpdatePost = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ postId, file, ...post }: IUpdatePost) => {
//       const data = await updatePost({ postId, file, ...post });
//       return data;
//     },
//     onSuccess: (data) => {
//       if (data?.$id) {
//         queryClient.invalidateQueries({ queryKey: ["UPDATE_POST", data?.$id] });
//       }
//     },
//   });
// };
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: UpdateUserProfileParams) => {
      const data = await updateUserProfile(updateData);
      return data;
    },
    onSuccess: (data) => {
      if (data?.$id) {
        queryClient.invalidateQueries({ queryKey: ["userProfile", data.$id] });
      }
    },
  });
};
