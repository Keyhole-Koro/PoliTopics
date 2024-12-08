// Define the parameter types for the function
interface FetchKokkaiDataParams {
  endpoint: string;
  query?: Record<string, string | number>;
}

// Define a generic type for the response data (can be adjusted as needed)
type KokkaiApiResponse = any;

export default async function fetchKokkaiRecords({ endpoint, query = {} }: FetchKokkaiDataParams): Promise<KokkaiApiResponse | undefined> {
  // Base URL
  const baseUrl = `https://kokkai.ndl.go.jp/api/${endpoint}`;
  
  // Convert query parameters to URL query string
  const queryString = new URLSearchParams(query as Record<string, string>).toString();
  
  // Construct full URL
  const url = `${baseUrl}?${queryString}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: KokkaiApiResponse = await response.json();
    console.log(`Data from ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
  }
}