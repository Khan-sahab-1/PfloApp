// services/attandiesSlice.js
//bug id 2555 Jamshed start
// Description: Created an API slice using Redux Toolkit's createApi to manage asynchronous actions related to attendees. This slice includes a query for fetching attendee data from the server, utilizing a POST request with JSON-RPC format. The generated hook allows components to easily access and display attendee data while handling loading and error states effectively.

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../utils/apiurls";
import urls from "../../../url";

export const attandiesSlice = createApi({
  reducerPath: 'attandiesApi', // optional but useful for naming
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getAttendees: builder.query({
      query: () => ({
        url: urls.getAttendeesData,
        method: 'POST',
        body: {
          jsonrpc: '2.0',
          method: 'call',
          params: {},
        },
      }),
     
    }),
  }),
});

// 👇 Export auto-generated hook
export const { useGetAttendeesQuery } = attandiesSlice;
//bug id 2555 Jamshed end
