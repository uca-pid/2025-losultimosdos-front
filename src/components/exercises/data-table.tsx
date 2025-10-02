import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  handleDelete: (id: number) => Promise<void>;
  onEdit: (exercise: TData) => void;
}
export function DataTable<TData extends { id: string | number }, TValue>({
  columns,
  data,
    handleDelete,
    onEdit,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });
    return (
    <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
        <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                return (
                    <TableHead
                    key={header.id}
                    className="text-left flex-1  text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                    >
                    {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                            )}
                    </TableHead>
                );
                }
                )}
            </TableRow>
            ))}
            <TableHead className="text-left flex-1  text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Acciones
            </TableHead>
        </TableHeader>
        <TableBody>
            {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
                <TableRow
                key={row.id}    
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                {row.getVisibleCells().map((cell) => (
                    <TableCell
                    key={cell.id}
                    className="text-sm text-gray-600 dark:text-gray-400"    
                    >
                    {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                    )}
                    </TableCell>
                ))}
                <TableCell className="px-4 py-2 flex gap-2 items-center justify-end">
                    <Button 
                        variant="outline"
                        onClick={() => onEdit(row.original)}
                    >   
                        Editar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={async () => {
                            await handleDelete(row.original.id as number);
                        }}  
                    >   
                        Eliminar
                    </Button>
                </TableCell>    
                </TableRow>
            ))
            ) : (   
            <TableRow>
                <TableCell
                colSpan={columns.length + 1}
                className="h-24 text-center"
                >
                No se encontraron datos.    
                </TableCell>
            </TableRow>
            )}  
        </TableBody>
        </Table>
    </div>
  );
}