"use server"

import db from "@/db"
import { competitions, groupTeams, teams } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"


export async function SubmitComp(formData: FormData) {
    const leagueData = {
        formalName: formData.get("formalName") as string,
        informalName: formData.get("informalName") as string,
        code: formData.get("code") as string,
        type: formData.get("type") as string,
        emblem: formData.get("emblem") as string,
    }

    await db.insert(competitions).values(
        leagueData
    )

    revalidatePath("/")
}

export async function DeleteComp(competitionId: any) {
    await db.delete(competitions).where(eq(competitions.id, competitionId))
    revalidatePath("/")
}

export async function SubmitTeam(formData: FormData) {
    const teamData = {
        name: formData.get("name") as string,
        shortName: formData.get("shortName") as string,
        tla: formData.get("tla") as string,
        crest: formData.get("crest") as string,
        address: formData.get("address") as string,
        website: formData.get("website") as string,
        founded: formData.get("founded") as string,
        clubColors: formData.get("clubColors") as string,
        venue: formData.get("venue") as string,
    }

    await db.insert(teams).values(
        teamData
    )

    revalidatePath("/")
}

export async function DeleteTeam(teamId: any) {
    await db.delete(teams).where(eq(teams.id, teamId))
    revalidatePath("/")
}

export async function SubmitTeamToGroup(formData: FormData) {
    const gId = formData.get("id") as unknown as number
    const cId = formData.get("teamId") as unknown as number

    await db.insert(groupTeams).values({
        groupId: gId,
        teamId: cId,
    })
    revalidatePath("/")
}