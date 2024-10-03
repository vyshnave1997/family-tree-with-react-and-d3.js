import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import familyData from "../new.json";
import "./FamilyTree.css"; 

const FamilyTree = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const marginTop = 100;
    const personWidth = 150;
    const personHeight = 60;
    const svgWidth = document.body.clientWidth;
    const svgHeight = 600;

    // Clear previous SVG content before re-rendering
    d3.select(svgRef.current).selectAll("*").remove();

    //  SVG container
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${svgWidth} ${svgHeight + marginTop}`)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .style("width", "100%")
      .style("height", "auto")
      .style("display", "block");

    //  zoomable
    const zoomGroup = svg.append("g");

  
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 2])
      .on("zoom", (event) => {
        zoomGroup.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Setup the tree layout
    const treeLayout = d3
      .tree()
      .size([svgWidth - 100, svgHeight - 100])
      .separation((a, b) => (a.parent === b.parent ? 2 : 4));

    const root = d3.hierarchy(processFamilyData(familyData));
    treeLayout(root);

    const g = zoomGroup
      .append("g")
      .attr("transform", `translate(60,${marginTop})`);

    // nodes 
    const nodes = g
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    //  rectangle 
    nodes
      .append("rect")
      .attr("x", -personWidth / 2)
      .attr("y", 0)
      .attr("width", personWidth)
      .attr("height", personHeight)
      .attr("rx", 10)
      .attr("ry", 10)
      .style("fill", "#f1f1f1")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1.5);

    //  text 
    nodes
      .append("text")
      .attr("dy", 5)
      .attr("dx", 0)
      .attr("y", 35)
      .style("text-anchor", "middle")
      .text((d) => d.data.name)
      .style("font-size", "15px")
      .style("font-weight", "normal")
      .style("letter-spacing", "1px");

    // image 
    nodes
      .append("image")
      .attr("xlink:href", (d) => d.data.profile_picture)
      .attr("x", -30)
      .attr("y", -40)
      .attr("width", 60)
      .attr("height", 60)
      .attr("clip-path", "circle(25px)");

    // border
    nodes
      .append("rect")
      .attr("x", -25)
      .attr("y", -35)
      .attr("width", 50)
      .attr("height", 50)
      .attr("rx", 25)
      .attr("ry", 25)
      .style("fill", "none")
      .style("stroke", "#ccc")
      .style("stroke-width", 2);

    // three-dot
    nodes
      .append("text")
      .attr("x", 40) 
      .attr("y", 7)
      .attr("dy", ".35em")
      .style("cursor", "pointer")
      .style("font-size", "30px") 
      .style("fill", "black") 
      .text("⋯") 
      .on("click", (event, d) => {
        alert(`Family Member: ${d.data.name}`);
      })
      .on("mouseover", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .style("fill", "white") 
          .style("font-size", "35px"); 
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .style("fill", "#8e8f8f") 
          .style("font-size", "30px"); 
      });

    // Draw lines connecting parent to children
    root.descendants().forEach((d) => {
      if (d.children && d.children.length > 0) {
        d.children.forEach((child) => {
          const childX = child.x;
          const childY = child.y;

          g.append("path")
            .attr(
              "d",
              `M${d.x + 100},${d.y + 100} V${d.y + 180} H${childX} V${
                childY - 35
              }`
            )
            .attr("stroke", "#e3e2e2")
            .attr("stroke-width", 1.5)
            .attr("fill", "none");
        });
      }
    });

    
    root.descendants().forEach((d) => {
      if (d.data.spouse && d.data.spouse.length > 0) {
        const spouseGroup = g.append("g");

        d.data.spouse.forEach((spouse, i) => {
          const spouseX = d.x + 200 + i * 10;
          const spouseY = d.y;

          //spouse rectangle
          spouseGroup
            .append("rect")
            .attr("x", spouseX - personWidth / 2)
            .attr("y", spouseY)
            .attr("width", personWidth)
            .attr("height", personHeight)
            .attr("rx", 10)
            .attr("ry", 10)
            .style("fill", "#f1f1f1")
            .attr("stroke", "#ccc")
            .attr("stroke-width", 1.5);

          //spouse name
          spouseGroup
            .append("text")
            .attr("x", spouseX)
            .attr("y", spouseY + 40)
            .style("text-anchor", "middle")
            .text(spouse.name)
            .style("font-size", "15px")
            .style("font-weight", "normal");

          // spouse image
          spouseGroup
            .append("image")
            .attr("xlink:href", spouse.image)
            .attr("x", spouseX - 35)
            .attr("y", spouseY - 40)
            .attr("width", 60)
            .attr("height", 60)
            .attr("clip-path", "circle(25px)");

        
          spouseGroup
            .append("rect")
            .attr("x", spouseX - 30)
            .attr("y", spouseY - 35)
            .attr("width", 50)
            .attr("height", 50)
            .attr("rx", 25)
            .attr("ry", 25)
            .style("fill", "none")
            .style("stroke", "#ccc")
            .style("stroke-width", 2);


          spouseGroup
            .append("text")
            .attr("x", spouseX + 40) 
            .attr("y", spouseY + 7)
            .attr("dy", ".35em")
            .style("cursor", "pointer")
            .style("font-size", "30px") 
            .style("fill", "black") 
            .text("⋯") 
            .on("click", () => {
              alert(`Spouse: ${spouse.name}`);
            })
            .on("mouseover", function () {
              d3.select(this)
                .transition()
                .duration(200)
                .style("fill", "white") 
                .style("font-size", "35px"); 
            })
            .on("mouseout", function () {
              d3.select(this)
                .transition()
                .duration(200)
                .style("fill", "#8a8a8a") 
                .style("font-size", "30px"); 
            });

          
          g.append("path")
            .attr(
              "d",
              `M${d.x},${d.y + personHeight} V${
                d.y + personHeight + 40
              } H${spouseX} V${spouseY + personHeight}`
            )
            .attr("stroke", "#e3e2e2")
            .attr("stroke-width", 1.8)
            .attr("fill", "none");
        });
      }
    });

    //make circle
    g.append("circle")
      .attr("cx", root.x + 17)
      .attr("cy", root.y - -7) 
      .attr("r", 10) 
      .style("fill", "#d5b04d")
      .style("stroke", "#d5b04d")
      .style("stroke-width", 2);

    // heart symbol
    g.append("text")
      .attr("x", root.x + 17)
      .attr("y", root.y - -11) 
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("font-size", "20px")
      .style("fill", "#212021")
      .text("🖤");

    function processFamilyData(data) {
      const idMap = {};
      data.forEach((person) => {
        idMap[person.id] = person;
      });

      const rootPerson = idMap[0]; 

      const buildTree = (person) => {
        if (person.children && person.children.length > 0) {
          person.children = person.children.map((childId) => {
            let childData = idMap[childId.id];
            return childData ? buildTree(childData) : childId;
          });
        } else {
          person.children = [];
        }
        return person;
      };

      return buildTree(rootPerson);
    }
  }, [familyData]);

  return <svg ref={svgRef}></svg>;
};

export default FamilyTree;
