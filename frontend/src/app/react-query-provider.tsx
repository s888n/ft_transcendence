"use client";
 
import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
 
 
export function ReactQueryProvider(props: any) {
  const [client] = React.useState(new QueryClient({
    defaultOptions: {
      queries: {
        // refetchOnWindowFocus: false,
        // refetchOnReconnect: false,
        // refetchOnMount: false,
      },
    },
  }));
 
  return (
    <QueryClientProvider client={client}>
      {props.children}
    </QueryClientProvider>
  );
}