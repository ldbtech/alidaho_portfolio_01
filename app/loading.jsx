"use client";

import LoadingState from "./components/LoadingState";

export default function Loading() {
  return (
    <div className="min-h-screen bg-theme flex items-center justify-center px-4">
      <LoadingState message="Loading page assets..." />
    </div>
  );
}
