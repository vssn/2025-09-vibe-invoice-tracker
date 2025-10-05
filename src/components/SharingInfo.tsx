
export function SharingInfo() {
  return (
    <div className="bg-card/80 rounded-lg border shadow-lg p-8 mb-6">
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-200/30 dark:to-blue-200/30 p-3 flex items-center justify-center shadow-lg">
            <img 
              src="/sharing.svg" 
              alt="Sharing feature illustration" 
              className="w-24 h-24 object-contain drop-shadow-md"
            />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Share Your Overview</h3>
          <p className="text-sm text-muted-foreground">
            Use the copy function to generate a shareable link containing all your invoice data. 
            Send it to someone else for review or save it as a backup for future reference. 
            The link contains all your data compressed and encoded for easy sharing.
          </p>
        </div>
      </div>
    </div>
  )
}