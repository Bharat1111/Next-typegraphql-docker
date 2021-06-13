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
import { withApollo } from "../utils/withApollo";

const CreatePost = () => {
  const router = useRouter();
  const { data, loading } = useMeQuery();
  const [createPost] = useCreatePostMutation();

  useEffect(() => {
    if (!loading && !data?.me) {
      router.replace("/login?next=" + router.pathname);
    }
  }, [data, router, loading]);
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ text: "", title: "" }}
        onSubmit={async (values) => {
          const { errors } = await createPost({ 
            variables: { input: values },
            update: (cache) => {
              cache.evict({ fieldName: 'posts:{}' })
            }
          });

          if (!errors) {
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

export default withApollo({ ssr: false })(CreatePost)
