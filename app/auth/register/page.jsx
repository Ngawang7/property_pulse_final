import RegisterForm from '@/components/RegisterForm';

const RegisterPage = () => {
  return (
    <section className="bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-center mb-8">Create an Account</h1>
            <RegisterForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage; 