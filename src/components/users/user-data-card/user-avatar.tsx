import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface UserAvatarProps {
  imageUrl?: string;
  firstName?: string;
  isMobile: boolean;
}

export const UserAvatar = ({
  imageUrl,
  firstName,
  isMobile,
}: UserAvatarProps) => {
  const size = isMobile ? "w-20 h-20" : "w-24 h-24";
  const textSize = isMobile ? "text-xl" : "text-2xl";

  return (
    <div
      className={`flex items-center justify-center ${
        !isMobile && "md:justify-start"
      }`}
    >
      <Avatar className={`${size} rounded-lg overflow-hidden`}>
        <AvatarImage
          src={imageUrl}
          alt={firstName || ""}
          className="object-cover w-full h-full"
        />
        <AvatarFallback
          className={`rounded-lg bg-gray-200 flex items-center justify-center ${size} ${textSize}`}
        >
          {firstName?.charAt(0)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};
