import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import "../styles/App.scss";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import { APIErrorContext } from "../providers/errorProvider.tsx";
import Routing from "../routing/Routing.tsx";
import { useContext, useState } from "react";

function App() {
  const { addError } = useContext(APIErrorContext);

  const mutationCache = new MutationCache({
    onError: (error) => {
      addError((error as { response: { data: string } })?.response?.data);
    },
  });
  const queryCache = new QueryCache({
    onError: (error) => {
      addError((error as { response: { data: string } })?.response?.data);
    },
  });

  const [queryClient] = useState(
    () => new QueryClient({ mutationCache, queryCache }),
  );
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Routing />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
