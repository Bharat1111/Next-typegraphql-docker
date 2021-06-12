import React from "react";
import { Formik, Form } from "formik";
import { Box, Button } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { InputField } from "../components/InputField";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";

const CreatePost = () => {
  const router = useRouter();
  const [{ data, fetching }] = useMeQuery();
  const [, createPost] = useCreatePostMutation();

  useEffect(() => {
    if (!fetching && !data?.me) {
      router.replace("/login?next=" + router.pathname);
    }
  }, [data, router, fetching]);
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ text: "", title: "" }}
        onSubmit={async (values) => {
          const { error } = await createPost({ input: values });

          if (!error) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <InputField
                // textarea
                name="text"
                placeholder="text..."
                label="Body"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(CreatePost);
