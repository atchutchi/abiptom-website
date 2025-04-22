import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface BlogSearchProps {
  onSearch: (query: string) => void;
}

export function BlogSearch({ onSearch }: BlogSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500" />
      <Input
        type="search"
        placeholder="Pesquisar posts, categorias ou tags..."
        value={searchQuery}
        onChange={handleSearch}
        className="w-full h-14 pl-14 pr-6 text-lg bg-white border-2 border-gray-200 rounded-full hover:border-yellow-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/50 focus:outline-none transition-all duration-200 placeholder:text-gray-400"
      />
    </div>
  );
} 