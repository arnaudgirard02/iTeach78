// ... imports restent les mêmes

export default function CorrectionProjectDetails() {
  // ... autres states restent les mêmes
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

  // ... autres fonctions restent les mêmes

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !project || !id) return;

    const newFiles = Array.from(files).filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`Le fichier "${file.name}" est trop volumineux. Taille maximum: 10MB`);
        return false;
      }
      return true;
    });

    setUploadingFiles(prev => [...prev, ...newFiles]);

    for (const file of newFiles) {
      const copyId = crypto.randomUUID();
      setProcessingFiles(prev => new Set(prev).add(copyId));

      try {
        const baremeFormatted = project.criteria
          .map(c => `${c.description}: ${c.points} points`)
          .join('\n');

        const correction = await getCorrectionFeedback(
          project.classe,
          project.sujet,
          baremeFormatted,
          file
        );

        const newCopy: CorrectionCopy = {
          id: copyId,
          name: file.name,
          content: await file.text(),
          correction,
          createdAt: new Date(),
          archived: false
        };

        const updatedCopies = [...project.copies, newCopy];
        await updateCorrection(id, { 
          copies: updatedCopies,
          status: 'in_progress'
        });
        
        setProject(prev => prev ? {
          ...prev,
          copies: updatedCopies,
          status: 'in_progress'
        } : null);
        
        toast.success(`Copie "${file.name}" corrigée avec succès`);
      } catch (error: any) {
        console.error('Error processing file:', error);
        toast.error(`Erreur lors du traitement de "${file.name}": ${error.message}`);
      } finally {
        setProcessingFiles(prev => {
          const next = new Set(prev);
          next.delete(copyId);
          return next;
        });
        setUploadingFiles(prev => prev.filter(f => f !== file));
      }
    }
  };

  // ... reste du code

  return (
    <div className="space-y-6">
      {/* ... autres éléments */}

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Copies ({activeCopies.length})</h2>
          <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            <Upload className="h-5 w-5 mr-2" />
            Ajouter des copies
            <input
              type="file"
              className="hidden"
              multiple
              accept=".txt,.pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {uploadingFiles.length > 0 && (
          <div className="mb-6 space-y-2">
            {uploadingFiles.map((file) => (
              <FileUploadProgress
                key={file.name}
                file={file}
                isProcessing={processingFiles.has(file.name)}
              />
            ))}
          </div>
        )}

        {/* ... reste du code */}
      </div>
    </div>
  );
}