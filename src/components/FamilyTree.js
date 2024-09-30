import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import familyData from "../newest.json"; // Load your external JSON data

const FamilyTree = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const marginTop = 100;
    const personWidth = 150;
    const personHeight = 60;
    const svgWidth = document.body.clientWidth;
    const svgHeight = 600;

    // Setup the tree layout
    const treeLayout = d3.tree().size([svgWidth - 100, svgHeight - 100]);
    const root = d3.hierarchy(familyData);

    // Assign positions to the nodes
    treeLayout(root);

    const svg = d3
      .select(svgRef.current)
      .attr("width", "100%")
      .attr("height", svgHeight + marginTop)
      .attr("viewBox", `0 0 ${svgWidth} ${svgHeight + marginTop}`)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .append("g")
      .attr("transform", `translate(0,${marginTop})`);

    // Draw group for each node (person)
    const nodeGroup = svg
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .attr("class", "person");

    // Person Node: rectangle
    nodeGroup
      .append("rect")
      .attr("width", personWidth)
      .attr("height", personHeight)
      .attr("rx", 10)
      .attr("fill", "#F1F1F1")
      .attr("stroke", "#ddd")
      .attr("stroke-width", 1);

    // Person image
    nodeGroup
      .append("image")
      .attr("xlink:href", (d) => d.data.imageUrl)
      .attr("x", 50)
      .attr("y", -30)
      .attr("width", 50)
      .attr("height", 50)
      .attr("clip-path", "circle(25px)");

    // Person name
    nodeGroup
      .append("text")
      .attr("x", 80)
      .attr("y", 50)
      .attr("text-anchor", "middle")
      .style("font-size", "19px")
      .style("font-family", "Arial, sans-serif")
      .style("fill", "#333")
      .text((d) => d.data.name);

    // Add clickable menu icon (three vertical dots) in the top-right corner of each person node
    nodeGroup
      .append("text")
      .attr("x", personWidth - 25)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "35px")
      .attr("cursor", "pointer")
      .attr("fill", "#857977")
      .text("⋯") // Three dots for the menu icon
      .on("click", (event, d) => {
        alert(`Menu clicked for ${d.data.name}`); // Example action on click
      })
      .on("mouseenter", function () {
        d3.select(this).style("fill", "white"); // Change color to white on hover
      })
      .on("mouseleave", function () {
        d3.select(this).style("fill", "#857977"); // Revert color on mouse leave
      });

    // Spouse rectangle and image
    nodeGroup
      .filter((d) => d.data.spouse)
      .append("rect")
      .attr("x", personWidth + 30)
      .attr("width", personWidth)
      .attr("height", personHeight)
      .attr("rx", 10)
      .attr("fill", "#F1F1F1")
      .attr("stroke", "#ddd")
      .attr("stroke-width", 1);

    nodeGroup
      .filter((d) => d.data.spouse)
      .append("image")
      .attr("xlink:href", (d) => d.data.spouseImageUrl)
      .attr("x", personWidth + 80)
      .attr("y", -30)
      .attr("width", 50)
      .attr("height", 50)
      .attr("clip-path", "circle(25px)");

    nodeGroup
      .filter((d) => d.data.spouse)
      .append("text")
      .attr("x", personWidth + 110)
      .attr("y", 50)
      .attr("text-anchor", "middle")
      .style("font-size", "19px")
      .style("font-family", "Arial, sans-serif")
      .style("fill", "#333")
      .text((d) => d.data.spouse);

    // Add clickable menu icon (three vertical dots) for spouse node
    nodeGroup
      .filter((d) => d.data.spouse)
      .append("text")
      .attr("x", personWidth * 2 + 30 - 20)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "35px")
      .attr("cursor", "pointer")
      .attr("fill", "#857977")
      .text("⋯") // Three dots for the menu icon
      .on("click", (event, d) => {
        alert(`Menu clicked for ${d.data.spouse}`); // Example action on click
      })
      .on("mouseenter", function () {
        d3.select(this).style("fill", "white"); // Change color to white on hover
      })
      .on("mouseleave", function () {
        d3.select(this).style("fill", "#857977"); // Revert color on mouse leave
      });

    // Spouse connection path
    nodeGroup
      .filter((d) => d.data.spouse)
      .append("path")
      .attr("d", (d) => {
        const personX = 75;
        const personY = 60;
        const spouseX = personWidth + 30 + 75;
        const spouseY = 60;
        const midX = (personX + spouseX) / 2 + -20;
        const verticalOffset = 30;

        return `
          M ${personX},${personY} 
          V ${personY + verticalOffset} 
          H ${midX} 
          V ${spouseY + verticalOffset} 
          H ${spouseX}
        `;
      })
      .attr("stroke", "#dfdede")
      .attr("fill", "none");

    // Spouse vertical line connection
    nodeGroup
      .filter((d) => d.data.spouse)
      .append("path")
      .attr("d", (d) => {
        const midX = (250 + personWidth + 30 + 80) / 2;
        const spouseBottomY = 60;
        const verticalLineLength = 30;

        return `
          M ${midX},${spouseBottomY}
          V ${spouseBottomY + verticalLineLength}
        `;
      })
      .attr("stroke", "#dfdede")
      .attr("fill", "none");

    // Vertical line between parent and children
    svg
      .selectAll(".link")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("class", "link")
      .attr("d", (d) => {
        const parentX = (d.parent.x + d.parent.x + personWidth + 180) / 2;
        const parentY = d.parent.y + personHeight + 30;
        const childX = d.x + personWidth / 2;
        const childY = d.y + -33;

        return `
          M ${parentX},${parentY} 
          V ${parentY + 40} 
          H ${childX} 
          V ${childY}
        `;
      })
      .attr("stroke", "#dfdede")
      .attr("fill", "none");

    // Add love emoji (❤️) in black on the top node with padding (5px)
    const firstNode = nodeGroup.filter((d, i) => i === 0);

    firstNode
      .append("rect")
      .attr("x", 77) // Adjust based on placement
      .attr("y", 10)
      .attr("width", 25)
      .attr("height", 25)
      .attr("rx", 15) // Rounded corner to make it circular
      .attr("fill", "#b08c4e")
      .attr("stroke", "#ddd");

    firstNode
      .append("text")
      .attr("x", 90) // Centering it inside the rect
      .attr("y", 30) // Adjusting it slightly above the image
      .attr("text-anchor", "middle")
      .attr("font-size", "20px")
      .attr("font-family", "Arial, sans-serif")
      .attr("font-color", "#000") // Make emoji black
      .text("🖤");

    // Add shadow filter (SVG filter)
    svg
      .append("defs")
      .append("filter")
      .attr("id", "shadow")
      .append("feDropShadow")
      .attr("dx", 3)
      .attr("dy", 3)
      .attr("stdDeviation", 2)
      .attr("flood-opacity", 0.3);
  }, []);

  return (
    <svg
      ref={svgRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    ></svg>
  );
};

export default FamilyTree;
