import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Layout from "@/components/layout";

const NotFound = () => {
  return (
    <Layout>
      <div className="flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="w-full space-y-6 text-center">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl transition-transform hover:scale-110">
              404
            </h1>
            <p className="text-gray-500">Página no encontrada</p>
          </div>
          <Button asChild>
            <Link to="/">Volver a la página de inicio</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
