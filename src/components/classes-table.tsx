import { columns } from "./classes/columns";
import { DataTable } from "./ui/data-table";
import { type GymClass } from "@/types";
import { type ColumnDef } from "@tanstack/react-table";
import AdminActionsColumn from "./classes/admin-actions-column";

export const ClassesTable = ({ classes }: { classes: GymClass[] }) => {
  const adminColumns: ColumnDef<GymClass>[] = [
    ...columns,
    {
      accessorKey: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        return <AdminActionsColumn row={row} />;
      },
    },
  ];

  return (
    <div className="">
      <DataTable columns={adminColumns} data={classes || []} />
    </div>
  );
};
