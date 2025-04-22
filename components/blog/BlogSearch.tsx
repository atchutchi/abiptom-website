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
    <div className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        type="search"
        placeholder="Pesquisar posts, categorias ou tags..."
        value={searchQuery}
        onChange={handleSearch}
        className="pl-12 w-full h-12 text-lg border-2 border-gray-200 rounded-full focus:border-yellow-400 focus:ring-yellow-400 transition-colors"
      />
    </div>
  );
} 