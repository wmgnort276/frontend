const setATagTargetBlank = (parentClassName : string) => {
    var parentElements : HTMLElement | null = document.querySelector(`.${parentClassName}`);
    
    var links = parentElements?.querySelectorAll('a');
    
    links?.forEach((anchor) => {
      anchor.setAttribute('target', '_blank');
    });
}

export default setATagTargetBlank;