import type { Project } from '~/type'
import type { Route } from './+types/index'
import ProjectCard from '~/components/ProjectCard'

export async function loader({ request }: Route.LoaderArgs): Promise<{ projects: Project[] }> {
  const res = await fetch('http://localhost:3000/projects')
  const data = await res.json()

  return { projects: data }
}

const Projects = ({ loaderData }: Route.ComponentProps) => {
  const { projects } = loaderData as { projects: Project[] }

  return (
    <>
      <h2 className="text-3xl font-bold text-white mb-8">
        🚀Projects
      </h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {
          projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        }
      </div>
    </>
  )
}

export default Projects