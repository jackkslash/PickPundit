"use server"

import db from "@/db"
import { competitions, groupTeams, groups, teams, teamsCompetitions } from "@/db/schema"
import { and, eq } from "drizzle-orm"
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

export async function DeleteTeam(teamId: any, competitionId: any) {

    if (!competitionId) {
        console.log("no competition id")
        await db.delete(teams).where(eq(teams.id, teamId))
    } else {
        console.log("competition id")
        await db.delete(teamsCompetitions).where(and(
            eq(teamsCompetitions.teamId, teamId),
            eq(teamsCompetitions.competitionId, competitionId)
        )
        )

        await db.delete(groupTeams).where(eq(groupTeams.teamId, teamId)
        )
    }

    revalidatePath("/")
}

export async function SubmitTeamToGroup(teamId: any, formData: FormData,) { // 
    const gId = formData.get("id") as unknown as number

    await db.insert(groupTeams).values({
        groupId: gId,
        teamId: teamId,
    })
    revalidatePath("/")
}

export async function AddTeamToComp(competitionId: any, formData: FormData,) {
    const cId = formData.get("id") as unknown as number
    const exists = await db.select().from(teamsCompetitions)
        .where(eq(teamsCompetitions.teamId, cId))
    console.log("exists", exists)
    if (exists.length == 0) {
        await db.insert(teamsCompetitions).values({
            teamId: cId,
            competitionId: competitionId
        })
        revalidatePath("/")
    }
    return
}

export async function DeleteGroup(groupId: any, competitionId: any) {
    await db.delete(groups).where(and(
        eq(groups.id, groupId),
        eq(groups.competitionId, competitionId)
    )
    )
    revalidatePath("/")
}

export async function AddGroup(id: number, formData: FormData) {
    const name = formData.get("group") as string
    await db.insert(groups).values({
        competitionId: id,
        name: name
    })
    revalidatePath("/")
}

