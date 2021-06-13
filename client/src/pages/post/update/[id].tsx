import React from "react";
import { Formik, Form } from "formik";
import { Box, Button } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";

import { InputField } from "../../../components/InputField";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { Layout } from "../../../components/Layout";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";

const UpdatePost = ({}) => {
    const router = useRouter();
    const [, updatePost] = useUpdatePostMutation();

    const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
    const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

    if(fetching) {
        return (
            <Layout>
                <div>Loading...</div>
            </Layout>
        )
    }

    if (!data?.post) {
        return (
            <Layout>
                <Box>could not find post</Box>
            </Layout>
        );
    }

    return (
        <Layout variant="small">
            <Formik
                initialValues={{ text: data.post.text, title: data.post.title }}
                onSubmit={async (values) => {
                    await updatePost({ id: intId, ...values })
                    router.back()
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
                    Update Post
                    </Button>
                </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(UpdatePost);
