import React from "react";
import { apiUrl, filterData } from "./data";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Navbar from  "./components/Navbar";
import Cards from "./components/Cards";
import Filter from "./components/Filter";
import Spinner from "./components/Spinner";  
  
const App = () => { 

  const [courses, setCourses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(filterData[0].title);
  
  function isDataNotFound(data) {
    return (
      data === null ||
      data === undefined ||
      (typeof data === "object" && !Array.isArray(data) && Object.keys(data).length === 0) ||
      (Array.isArray(data) && data.length === 0)
    );
  }

  async function fetchData(){
    setLoading(true);
    setError(null);
    try{
      let response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      let output = await response.json();
      setCourses(output.data);
    }
    catch(fetchError){
      setError("Error 404: Unable to fetch courses. Please try again later.");
      toast.error("Network me koi dikkat hai");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-bgDark2">
      <div>
        <Navbar/>
      </div>

      <div>
        <div>
          <Filter filterData = {filterData} category = {category} setCategory = {setCategory}/>
        </div>

        <div className="w-11/12 max-w-[1200px] mx-auto">
          {error && (
            <div className="text-center my-8">
              <div className="text-red-300 text-3xl md:text-4xl font-bold">
                {error}
              </div>
              <button
                onClick={fetchData}
                className="mt-6 px-5 py-3 bg-white text-bgDark2 font-semibold rounded-lg shadow-lg transition hover:bg-gray-200"
              >
                Retry
              </button>
            </div>
          )}

          <div className="flex flex-wrap justify-center items-center min-h-[50vh]">
            {loading ? (
              <Spinner />
            ) : error ? (
              <></>
            ) : isDataNotFound(courses) ? (
              <div className="text-center py-16">
                <div className="text-white text-3xl md:text-4xl font-semibold">
                  Data not found
                </div>
                <button
                  onClick={fetchData}
                  className="mt-6 px-5 py-3 bg-white text-bgDark2 font-semibold rounded-lg shadow-lg transition hover:bg-gray-200"
                >
                  Refresh
                </button>
              </div>
            ) : (
              <Cards courses={courses} category={category} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
