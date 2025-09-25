import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminTable from "../admin-table";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import apiService from "@/services/api.service";
import { type GymClass } from "@/types";

// Mock dependencies
jest.mock("@clerk/nextjs", () => ({
  useAuth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/services/api.service", () => ({
  delete: jest.fn(),
  put: jest.fn(),
}));

// Mock Sheet component and its parts
jest.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children, open, onOpenChange }: any) => (
    <div
      data-testid="sheet"
      data-open={open}
      onClick={() => onOpenChange(false)}
    >
      {children}
    </div>
  ),
  SheetContent: ({ children }: any) => (
    <div data-testid="sheet-content">{children}</div>
  ),
  SheetHeader: ({ children }: any) => (
    <div data-testid="sheet-header">{children}</div>
  ),
  SheetTitle: ({ children }: any) => (
    <div data-testid="sheet-title">{children}</div>
  ),
  SheetTrigger: ({ children, onClick }: any) => (
    <div data-testid="sheet-trigger" onClick={onClick}>
      {children}
    </div>
  ),
}));

// Mock columns
jest.mock("@/components/classes/columns", () => ({
  columns: [
    {
      accessorKey: "name",
      header: "Nombre de la clase",
      cell: ({ row }: any) => (
        <div>
          <div>{row.getValue("name")}</div>
          <div>{row.original.description}</div>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Fecha",
      cell: ({ row }: any) =>
        new Date(row.getValue("date")).toLocaleDateString(),
    },
    {
      accessorKey: "time",
      header: "Hora",
    },
    {
      accessorKey: "capacity",
      header: "Capacidad",
    },
    {
      accessorKey: "enrolled",
      header: "Inscritos",
    },
  ],
}));

// Mock DataTable component
jest.mock("@/components/ui/data-table", () => ({
  DataTable: ({ data, columns, extraColumns }: any) => (
    <div data-testid="data-table">
      <table>
        <tbody>
          {data.map((item: any, index: number) => (
            <tr key={item.id || index} data-testid="table-row">
              {columns.map((col: any) => (
                <td key={col.accessorKey}>
                  {col.cell
                    ? col.cell({
                        row: {
                          getValue: (key: string) => item[key],
                          original: item,
                        },
                      })
                    : item[col.accessorKey]}
                </td>
              ))}
              {extraColumns?.map((col: any) => (
                <td key={col.accessorKey}>
                  {col.cell({ row: { original: item } })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
}));

// Mock ClassForm component
jest.mock("@/components/forms/class", () => ({
  ClassForm: ({ defaultValues, onSubmit, isEdit }: any) => (
    <form
      data-testid="class-form"
      onSubmit={(e) => {
        e.preventDefault();

        const values = isEdit
          ? defaultValues
          : {
              id: 1,
              name: "New Class",
              description: "New Description",
              time: "10:00",
              date: new Date("2025-01-01"),
              capacity: 20,
              enrolled: 0,
              createdById: "user123",
              users: [],
            };
        onSubmit(values);
      }}
    >
      <button type="submit">Submit</button>
    </form>
  ),
}));

describe("AdminTable", () => {
  const mockClasses: GymClass[] = [
    {
      id: 1,
      name: "Yoga Class",
      description: "Beginner friendly yoga",
      time: "10:00",
      date: new Date("2025-01-01"),
      capacity: 20,
      enrolled: 5,
      createdById: "user123",
      users: ["user1", "user2", "user3", "user4", "user5"],
    },
    {
      id: 2,
      name: "HIIT Training",
      description: "High intensity workout",
      time: "11:00",
      date: new Date("2025-01-01"),
      capacity: 15,
      enrolled: 3,
      createdById: "user123",
      users: ["user6", "user7", "user8"],
    },
  ];

  const mockToken = "mock-token";
  const mockRouter = { refresh: jest.fn() };
  const mockGetToken = jest.fn().mockResolvedValue(mockToken);

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockImplementation(() => ({
      getToken: mockGetToken,
    }));
    (useRouter as jest.Mock).mockImplementation(() => mockRouter);
  });

  it("renders the table with provided classes", () => {
    render(<AdminTable classes={mockClasses} />);

    const table = screen.getByTestId("data-table");
    expect(table).toBeInTheDocument();

    const rows = screen.getAllByTestId("table-row");
    expect(rows).toHaveLength(mockClasses.length);
  });

  it("renders edit and delete buttons for each class", () => {
    render(<AdminTable classes={mockClasses} />);

    const editButtons = screen.getAllByText("Editar");
    const deleteButtons = screen.getAllByText("Eliminar");

    expect(editButtons).toHaveLength(mockClasses.length);
    expect(deleteButtons).toHaveLength(mockClasses.length);
  });

  it("initially renders with sheet closed", () => {
    render(<AdminTable classes={mockClasses} />);

    const sheet = screen.getByTestId("sheet");
    expect(sheet).toHaveAttribute("data-open", "false");
  });

  it("renders empty state when no classes are provided", () => {
    render(<AdminTable classes={[]} />);

    const rows = screen.queryAllByTestId("table-row");
    expect(rows).toHaveLength(0);
  });

  describe("Edit functionality", () => {
    it("opens sheet when edit button is clicked", () => {
      render(<AdminTable classes={mockClasses} />);

      const editButton = screen.getAllByText("Editar")[0];
      fireEvent.click(editButton);

      const sheet = screen.getByTestId("sheet");
      expect(sheet).toHaveAttribute("data-open", "true");
    });

    it("displays the correct class data in the form when editing", () => {
      render(<AdminTable classes={mockClasses} />);

      const editButton = screen.getAllByText("Editar")[0];
      fireEvent.click(editButton);

      const form = screen.getByTestId("class-form");
      expect(form).toBeInTheDocument();
    });

    it("updates class and refreshes on successful edit", async () => {
      const updatedClass = { ...mockClasses[0], name: "Updated Yoga Class" };
      (apiService.put as jest.Mock).mockResolvedValueOnce({
        data: updatedClass,
      });

      render(<AdminTable classes={mockClasses} />);

      const editButton = screen.getAllByText("Editar")[0];
      fireEvent.click(editButton);

      const form = screen.getByTestId("class-form");
      expect(form).toBeInTheDocument();

      fireEvent.submit(form);

      await waitFor(() => {
        expect(apiService.put).toHaveBeenCalledWith(
          `/admin/class/${mockClasses[0].id}`,
          mockClasses[0],
          mockToken
        );
        expect(mockRouter.refresh).toHaveBeenCalled();
      });

      const sheet = screen.getByTestId("sheet");
      expect(sheet).toHaveAttribute("data-open", "false");
    });

    it("closes sheet when clicking outside", () => {
      render(<AdminTable classes={mockClasses} />);

      const editButton = screen.getAllByText("Editar")[0];
      fireEvent.click(editButton);

      const sheet = screen.getByTestId("sheet");
      fireEvent.click(sheet);

      expect(sheet).toHaveAttribute("data-open", "false");
    });
  });

  describe("Delete functionality", () => {
    it("calls delete API and refreshes on successful delete", async () => {
      (apiService.delete as jest.Mock).mockResolvedValueOnce({});

      render(<AdminTable classes={mockClasses} />);

      const deleteButton = screen.getAllByText("Eliminar")[0];
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(apiService.delete).toHaveBeenCalledWith(
          `/admin/class/${mockClasses[0].id}`,
          mockToken
        );
        expect(mockRouter.refresh).toHaveBeenCalled();
      });
    });

    it("disables delete button while deleting", async () => {
      let resolveDelete: (value: unknown) => void;
      const deletePromise = new Promise((resolve) => {
        resolveDelete = resolve;
      });
      (apiService.delete as jest.Mock).mockReturnValue(deletePromise);

      render(<AdminTable classes={mockClasses} />);

      const deleteButton = screen.getAllByText("Eliminar")[0];
      fireEvent.click(deleteButton);

      expect(deleteButton).toBeDisabled();
      expect(screen.getByText("Eliminando")).toBeInTheDocument();

      resolveDelete!({});

      await waitFor(() => {
        const updatedButton = screen.getAllByText("Eliminar")[0];
        expect(updatedButton).not.toBeDisabled();
      });
    });

    it("handles delete when token is not available", async () => {
      mockGetToken.mockResolvedValueOnce(null);

      render(<AdminTable classes={mockClasses} />);

      const deleteButton = screen.getAllByText("Eliminar")[0];
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(apiService.delete).not.toHaveBeenCalled();
      });
    });
  });

  describe("Error handling and edge cases", () => {
    it("handles API error during edit", async () => {
      const error = new Error("API Error");
      (apiService.put as jest.Mock).mockRejectedValueOnce(error);

      render(<AdminTable classes={mockClasses} />);

      const editButton = screen.getAllByText("Editar")[0];
      fireEvent.click(editButton);

      const form = screen.getByTestId("class-form");
      fireEvent.submit(form);

      await waitFor(() => {
        expect(apiService.put).toHaveBeenCalled();

        const sheet = screen.getByTestId("sheet");
        expect(sheet).toHaveAttribute("data-open", "true");
      });
    });

    it("handles API error during delete", async () => {
      const error = new Error("API Error");
      (apiService.delete as jest.Mock).mockRejectedValueOnce(error);

      render(<AdminTable classes={mockClasses} />);

      const deleteButton = screen.getAllByText("Eliminar")[0];
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(apiService.delete).toHaveBeenCalled();

        expect(deleteButton).not.toBeDisabled();
        expect(screen.queryByText("Eliminando")).not.toBeInTheDocument();
      });
    });

    it("handles multiple rapid delete clicks", async () => {
      let deleteResolve: (value: unknown) => void;
      const deletePromise = new Promise((resolve) => {
        deleteResolve = resolve;
      });
      (apiService.delete as jest.Mock).mockReturnValue(deletePromise);

      render(<AdminTable classes={mockClasses} />);

      const deleteButton = screen.getAllByText("Eliminar")[0];

      fireEvent.click(deleteButton);
      fireEvent.click(deleteButton);
      fireEvent.click(deleteButton);

      expect(deleteButton).toBeDisabled();
      expect(screen.getByText("Eliminando")).toBeInTheDocument();

      expect(apiService.delete).toHaveBeenCalledTimes(1);

      deleteResolve!({});

      await waitFor(() => {
        expect(deleteButton).not.toBeDisabled();
      });
    });

    it("handles concurrent edit and delete operations", async () => {
      let editResolve: (value: unknown) => void;
      const editPromise = new Promise((resolve) => {
        editResolve = resolve;
      });
      (apiService.put as jest.Mock).mockReturnValue(editPromise);

      render(<AdminTable classes={mockClasses} />);

      const editButton = screen.getAllByText("Editar")[0];
      fireEvent.click(editButton);

      const form = screen.getByTestId("class-form");
      fireEvent.submit(form);

      const deleteButton = screen.getAllByText("Eliminar")[0];
      fireEvent.click(deleteButton);

      expect(apiService.delete).toHaveBeenCalled();

      editResolve!({});

      await waitFor(() => {
        expect(mockRouter.refresh).toHaveBeenCalledTimes(2);
      });
    });
  });
});
