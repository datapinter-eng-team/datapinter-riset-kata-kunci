import { useState } from 'react';
import { Download, FileText, AlertCircle } from 'lucide-react';

type Keyword = {
    keyword: string;
    search_volume: number;
};

type Keywords = {data: Keyword[]};

const KeywordToCsvConverter = () => {
    const [inputData, setInputData] = useState('');
    const [fileName, setFileName] = useState('keywords');
    const [error, setError] = useState('');
    const [csvData, setCsvData] = useState('');

    const convertToCSV = (keywords: Keywords): string => {
        if (!keywords || keywords.data.length === 0) return '';

        // CSV header
        const header = 'kata_pencarian,jumlah_pencarian\n';

        // CSV rows
        const rows = keywords.data.map(item =>
            `"${item.keyword.replace(/"/g, '""')}",${item.search_volume}`
        ).join('\n');

        return header + rows;
    };

    const handleConvert = () => {
        try {
            setError('');

            if (!inputData.trim()) {
                setError('Please enter some data');
                return;
            }

            // Parse the JSON input
            const parsedData: Keywords = JSON.parse(inputData);

            // Validate the structure
            if (!Array.isArray(parsedData)) {
                throw new Error('Input must be an array');
            }

            for (let i = 0; i < parsedData.length; i++) {
                const item = parsedData[i];
                if (!item || typeof item !== 'object') {
                    throw new Error(`Item at index ${i} is not an object`);
                }
                if (typeof item.keyword !== 'string') {
                    throw new Error(`Item at index ${i} missing or invalid 'keyword' field`);
                }
                if (typeof item.search_volume !== 'number') {
                    throw new Error(`Item at index ${i} missing or invalid 'search_volume' field`);
                }
            }

            // Convert to CSV
            const csv = convertToCSV(parsedData);
            setCsvData(csv);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid JSON format');
            setCsvData('');
        }
    };

    const handleDownload = () => {
        if (!csvData) return;

        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    const sampleData = `[
  {"keyword": "react tutorial", "search_volume": 12500},
  {"keyword": "javascript basics", "search_volume": 8900},
  {"keyword": "web development", "search_volume": 15600}
]`;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Keywords to CSV Converter
                </h1>
                <p className="text-gray-600">
                    Convert an array of keyword objects to CSV format and download the file
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
                            Input JSON Data
                        </label>
                        <textarea
                            id="input"
                            value={inputData}
                            onChange={(e) => setInputData(e.target.value)}
                            placeholder={sampleData}
                            className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="filename" className="block text-sm font-medium text-gray-700 mb-2">
                            File Name (without extension)
                        </label>
                        <input
                            id="filename"
                            type="text"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="keywords"
                        />
                    </div>

                    <button
                        onClick={handleConvert}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        <FileText size={20} />
                        Convert to CSV
                    </button>

                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            <AlertCircle size={16} />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}
                </div>

                {/* Output Section */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="output" className="block text-sm font-medium text-gray-700 mb-2">
                            CSV Output
                        </label>
                        <textarea
                            id="output"
                            value={csvData}
                            readOnly
                            className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50"
                            placeholder="CSV output will appear here..."
                        />
                    </div>

                    <button
                        onClick={handleDownload}
                        disabled={!csvData}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        <Download size={20} />
                        Download CSV
                    </button>
                </div>
            </div>

            {/* Instructions */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Instructions:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>1. Paste your JSON array of keyword objects in the input field</li>
                    <li>2. Each object should have 'keyword' (string) and 'search_volume' (number) properties</li>
                    <li>3. Optionally change the output file name</li>
                    <li>4. Click "Convert to CSV" to generate the CSV format</li>
                    <li>5. Click "Download CSV" to save the file to your computer</li>
                </ul>
            </div>

            {/* Schema Reference */}
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Expected Schema:</h3>
                <pre className="text-sm text-gray-700 font-mono">
{`type Keyword = {
  keyword: string;
  search_volume: number;
}

type Keywords = Keyword[];`}
        </pre>
            </div>
        </div>
    );
};

export default KeywordToCsvConverter;