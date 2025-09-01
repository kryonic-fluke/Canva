import { ProjectAnalysis } from "../api/Analysis";


interface AnalysisViewProps {
  isAnalyzing: boolean;
  isError: boolean;
  error: Error | null;
  data: ProjectAnalysis | undefined;
  onGoBack: () => void;
}


export const AnalysisView = ({ isAnalyzing, isError, error, data, onGoBack }: AnalysisViewProps) => {
  return (
    <div  className="flex flex-col h-full overflow-auto">
     <div className="flex items-center mb-4">
      <button 
        onClick={onGoBack} 
        className="mr-4 text-gray-600 hover:text-gray-900"
      >
        &larr; Back 
      </button>

      <h3 className="font-bold text-gray-800 text-xl"> Project Analyst</h3>
    </div>



    {isAnalyzing && (
  <div className="text-center p-8">
    <p className="font-semibold text-indigo-600">Analyzing your canvas... ✨</p>
    <p className="text-sm text-gray-500 mt-2">This may take a few seconds.</p>
  </div>
)}

{isError && (
  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
    <p className="font-bold">Analysis Failed</p>
    <p>{error?.message || 'An unknown error occurred.'}</p>
  </div>
)}


{data && (
  <div className="overflow-y-auto">

    <p className="mb-4 p-4 bg-gray-100 rounded-lg text-gray-800 italic">
      {data.summary}
    </p>

    <div className="p-4 rounded-lg mb-4 bg-green-100">
      <h4 className="font-bold text-lg mb-2 flex items-center">
        <span className="mr-2 text-xl">👍</span>
        Strengths
      </h4>
      <ul className="list-disc pl-5 space-y-1 text-gray-800">
        {data.strengths?.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    </div>

    <div className="p-4 rounded-lg mb-4 bg-yellow-100">
      <h4 className="font-bold text-lg mb-2 flex items-center">
        <span className="mr-2 text-xl">⚠️</span>
        Potential Risks
      </h4>
      <ul className="list-disc pl-5 space-y-1 text-gray-800">
        {data.risks?.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    </div>

    <div className="p-4 rounded-lg mb-4 bg-blue-100">
      <h4 className="font-bold text-lg mb-2 flex items-center">
        <span className="mr-2 text-xl">💡</span>
        Suggestions
      </h4>
      <ul className="list-disc pl-5 space-y-1 text-gray-800">
        {data.suggestions?.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    </div>

  </div>
)}

    </div>
  );
}