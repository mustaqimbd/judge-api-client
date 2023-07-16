import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAxios from "./UseAxios";

function App() {
  const { user } = useContext(AuthContext);
  const [instance] = useAxios();
  const navigate = useNavigate();
  const [output, setOutput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const codeSnippet = form.codeSnippet.value;
    if (!user) {
      return redirectToLogin();
    }
    if (!selectedLanguage) {
      return setError("Please select a language!");
    }
    setLoading(true);
    instance
      .post(`/code-submission`, {
        user: user.email,
        code: codeSnippet,
        language: selectedLanguage,
      })
      .then((res) => {
        if (!res.data.error) {
          instance
            .post(`/code-execution/${res.data.codeId}`, { user: user.email })
            .then((res) => {
              if (!res.data.error) {
                instance
                  .get(
                    `/result-retrieve/${res.data.executeCodeId}/${user.email}`,
                    {
                      user: user.email,
                    }
                  )
                  .then((res) => {
                    if (!res.data.error) {
                      setOutput(res.data.codeOutput);
                      setLoading(false);
                    } else {
                      setOutput(res.data.error || res.data.status);
                      setLoading(false);
                    }
                  })
                  .catch((err) => {
                    setOutput(err.error);
                    setLoading(false);
                  });
              } else {
                setOutput(res.data.error || res.data.status);
                setLoading(false);
              }
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
            });
        } else {
          setOutput(res.data.error || res.data.status);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const redirectToLogin = () => {
    Swal.fire({
      title: "Please Login to submit the code snippet.",
      text: "You have to login first to submit the code snippet",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Login",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login", { replace: true });
      }
    });
  };

  return (
    <>
      <div className="container mx-auto mt-5">
        <h1 className="text-2xl font-bold text-center mb-4">Code Submission</h1>
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto p-4 bg-white shadow rounded"
        >
          <div>
            <label htmlFor="code" className="text-lg font-semibold">
              Code
            </label>
            <textarea
              id="code"
              name="codeSnippet"
              required
              className="w-full h-40 border border-gray-300 rounded p-2 mt-2 focus:outline-none"
            />
          </div>
          {error && !selectedLanguage && (
            <p className="text-red-600">{error}</p>
          )}
          <div className="flex justify-between items-center">
            <select
              className="h-8 mb-auto focus:outline-none cursor-pointer"
              name="programming-language"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              <option value="">-- Select Language --</option>
              <option value="javascript">JavaScript</option>
            </select>

            {loading ? (
              <div
                aria-label="Loading..."
                role="status"
                className="flex items-center space-x-2"
              >
                <svg
                  className="h-8 w-8 animate-spin stroke-gray-500"
                  viewBox="0 0 256 256"
                >
                  <line
                    x1="128"
                    y1="32"
                    x2="128"
                    y2="64"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                  <line
                    x1="195.9"
                    y1="60.1"
                    x2="173.3"
                    y2="82.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                  <line
                    x1="224"
                    y1="128"
                    x2="192"
                    y2="128"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                  <line
                    x1="195.9"
                    y1="195.9"
                    x2="173.3"
                    y2="173.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                  <line
                    x1="128"
                    y1="224"
                    x2="128"
                    y2="192"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                  <line
                    x1="60.1"
                    y1="195.9"
                    x2="82.7"
                    y2="173.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                  <line
                    x1="32"
                    y1="128"
                    x2="64"
                    y2="128"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                  <line
                    x1="60.1"
                    y1="60.1"
                    x2="82.7"
                    y2="82.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                </svg>
                <span className=" text-gray-600">Submission Queued...</span>
              </div>
            ) : (
              <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4">
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="container mx-auto mt-5">
        <h1 className="text-2xl font-bold text-center mb-4">Result</h1>
        <div className="max-w-xl mx-auto">
          <p className="w-full h-40 border border-gray-300 rounded p-2 mt-2 overflow-auto">
            {output}
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
