"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function MessagesContent() {
  const searchParams = useSearchParams();
  const freelanceId = searchParams.get("freelanceId");

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/dashboard/company/candidates">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux candidatures
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Messagerie</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              La fonctionnalité de messagerie sera bientôt disponible.
            </p>
            {freelanceId && (
              <p className="text-sm text-muted-foreground mb-6">
                ID du freelance à contacter : {freelanceId}
              </p>
            )}
            <Button variant="outline" asChild>
              <Link href="/dashboard/company">Retour au tableau de bord</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
