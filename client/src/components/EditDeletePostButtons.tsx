import React from "react";
import { Box, IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  const { data: meData } = useMeQuery();
  const [deletePost] = useDeletePostMutation();

  if (meData?.me?.id !== creatorId) {
    return null;
  }

  return (
    <Box>
      <NextLink href="/post/update/[id]" as={`/post/update/${id}`}>
        <IconButton as={Link} mr={4} icon={<EditIcon />} aria-label="Edit Post" />
      </NextLink>
      <IconButton
        colorScheme='red'
        icon={<DeleteIcon />}
        aria-label="Delete Post"
        onClick={() => {
          deletePost({ variables: { id }, update: (cache) => {
            cache.evict({
              id: 'Post:' + id,
            })
          } });
        }}
      />
    </Box>
  );
};