import type { Route } from './+types/index'

export async function loader({ request }: Route.LoaderArgs): Promise<any> {
  const res = await fetch('http://localhost:3000/projects')
  const data = await res.json()

  return { projects: data }
}

const Projects = ({ loaderData }: Route.ComponentProps) => {
  const { projects } = loaderData
  console.log(projects)

  return (
    <>
      <h2 className="text-3xl font-bold text-white mb-8">
        🚀Projects
      </h2>
    </>
  )
}

export default Projects