"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/classes/columns";
import { GymClass } from "@/types";

export const FullClasses = ({ fullClasses }: { fullClasses: GymClass[] }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold">Clases Completas</h1>
      </div>
      <DataTable
        columns={columns.slice(0, 3)}
        data={fullClasses || []}
        headerClassName="last:items-center last:justify-end last:w-min"
      />
    </>
  );
};
