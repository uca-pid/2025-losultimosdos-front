interface UserInfoProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  id: string;
  isMobile: boolean;
}

export const UserInfo = ({
  firstName,
  lastName,
  email,
  id,
  isMobile,
}: UserInfoProps) => {
  if (isMobile) {
    return (
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-gray-500">Nombre</div>
        <div className="text-right text-gray-900 dark:text-gray-100">
          {firstName || "N/A"}
        </div>

        <div className="text-gray-500">Apellido</div>
        <div className="text-right text-gray-900 dark:text-gray-100">
          {lastName || "N/A"}
        </div>

        <div className="text-gray-500">Email</div>
        <div className="text-right text-gray-900 dark:text-gray-100 break-all">
          {email || "N/A"}
        </div>

        <div className="text-gray-500">ID</div>
        <div className="text-right text-gray-900 dark:text-gray-100 break-all">
          {id}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-gray-500">Nombre</p>
        <p className="font-medium">{firstName || "N/A"}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Apellido</p>
        <p className="font-medium">{lastName || "N/A"}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Email</p>
        <p className="font-medium break-all">{email || "N/A"}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">ID de Usuario</p>
        <p className="font-medium text-xs break-all">{id}</p>
      </div>
    </div>
  );
};
