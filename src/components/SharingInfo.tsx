export function SharingInfo() {
  return (
    <div className="bg-card rounded-lg border shadow-sm p-6 mb-6">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-100/20 dark:to-blue-100/20 p-2 flex items-center justify-center">
            <img 
              src="/sharing.svg" 
              alt="Sharing feature illustration" 
              className="w-full h-full object-contain"
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