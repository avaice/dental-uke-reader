export const DropOverlay = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-80">
    <div className="rounded-lg border border-gray-400 border-dashed bg-white p-8">
      <div className="text-center">
        <div className="mb-4 text-4xl">📁</div>
        <div className="mb-2 font-bold text-xl">
          UKEファイルをドロップしてください
        </div>
        <div className="text-gray-600">
          .UKE形式のファイルのみ対応しています
        </div>
      </div>
    </div>
  </div>
);
