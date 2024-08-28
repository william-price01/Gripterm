import React, { createContext, useState, useContext, ReactNode } from "react";

interface Response {
  identifier: string;
  response: any; // You might want to define a more specific type here
}

interface ResponseContextType {
  response: Response | null;
  setResponse: React.Dispatch<React.SetStateAction<Response | null>>;
}

const ResponseContext = createContext<ResponseContextType | undefined>(
  undefined,
);

export const ResponseProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [response, setResponse] = useState<Response | null>(null);

  return (
    <ResponseContext.Provider value={{ response, setResponse }}>
      {children}
    </ResponseContext.Provider>
  );
};

export const useResponse = (): ResponseContextType => {
  const context = useContext(ResponseContext);
  if (context === undefined) {
    throw new Error("useResponse must be used within a ResponseProvider");
  }
  return context;
};
