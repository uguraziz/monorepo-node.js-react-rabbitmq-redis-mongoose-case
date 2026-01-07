import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select.jsx';

export const ProjectFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="flex gap-4 mb-4">
      <Select
        value={filters.status || 'all'}
        onValueChange={(value) => onFilterChange({ ...filters, status: value === 'all' ? '' : value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Tüm Durumlar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Durumlar</SelectItem>
          <SelectItem value="todo">Yapılacak</SelectItem>
          <SelectItem value="in-progress">Devam Ediyor</SelectItem>
          <SelectItem value="done">Tamamlandı</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

