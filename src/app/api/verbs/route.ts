import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateForms } from "@/lib/generateForms";

type CreateVerbRequest = {
  masu: string;
  meaning: string;
  group: string; // "1"=Godan, "2"=Ichidan, "3"=Irregular
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    let verbs;

    if (!q) {
      verbs = await prisma.verb.findMany({
        orderBy: { id: "asc" },
      });
    } else {
      verbs = await prisma.verb.findMany({
        where: {
          OR: [
            { kanji: { contains: q[0] } },
            { stem: { contains: q } },
            { meaning: { contains: q } },
            { masuRead: { contains: q } },
            { dictRead: { contains: q } },
            { teRead: { contains: q } },
            { naiRead: { contains: q } },
            { taRead: { contains: q } },
          ],
        },
        orderBy: { id: "asc" },
      });
    }

    return NextResponse.json(verbs);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("GET /api/verbs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch verbs", detail: error.message },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const body: CreateVerbRequest = await req.json();
    const { masu, meaning, group } = body;

    if (!masu || !meaning || !group) {
      return NextResponse.json(
        { error: "masu, meaning, and group are required" },
        { status: 400 }
      );
    }

    // <-- ini penting, await karena generateForms async
    const forms = await generateForms(masu, group);

    const verb = await prisma.verb.create({
      data: {
        masu: forms.masu,
        meaning,
        group,
        stem: forms.stem,
        dict: forms.dict,
        te: forms.te,
        nai: forms.nai,
        ta: forms.ta,
        masuRead: forms.masuRead,
        dictRead: forms.dictRead,
        teRead: forms.teRead,
        naiRead: forms.naiRead,
        taRead: forms.taRead,
        kanji: forms.kanji,
      },
    });

    return NextResponse.json(verb);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create verb", detail: error.message },
      { status: 500 }
    );
  }
}

