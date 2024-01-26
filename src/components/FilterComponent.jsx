import filterStyle from "@/Styles/filter.module.css"


const FilterComponent = ({categoryInfo, setFilterByBrand, category, setFilterByTags}) => {
  const filter = (brand, tags) => {
    if (brand !== undefined) {
      setFilterByBrand(prev => {
        if (prev.some(x => x == brand)) {
          return prev.filter(x => x !== brand);
        }
        return [...prev, brand]
      });
      console.log(categoryInfo);
    }
    if (tags !== undefined) {
      setFilterByTags(prev => {
        if (prev.some(x => x == tags)) {
          return prev.filter(x => x !== tags);
        }
        return [...prev, tags];
      });
    }
  }

  return (
    <div className={filterStyle.filter_container} >
      <div className={filterStyle.tags} >
        <p>Tags</p>
        {
          categoryInfo?.filterTags.map((tag, index) => {
            return (
              <div key={"tag" + index} className={filterStyle.eachTag} >
                <input onChange={() => {filter(undefined, tag)}} id={"tag" + index} type="checkbox" key={`brand-${index}`} value={tag} />
                <label htmlFor={"tag" + index} > {tag}</label>
              </div>
            )
          })
        }
      </div>
    </div>

  )
}

export default FilterComponent