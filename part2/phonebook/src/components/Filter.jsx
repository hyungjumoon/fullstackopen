const Filter = ({search, setSearch}) => {
  return (
    <div>
      filter shown with <input value={search} onChange={({target}) => setSearch(target.value)} />
    </div>
  )
}

export default Filter