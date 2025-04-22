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
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="search"
        placeholder="Pesquisar posts..."
        value={searchQuery}
        onChange={handleSearch}
        className="pl-10 w-full"
      />
    </div>
  );
} 