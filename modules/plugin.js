/**
 * GrowCord - A discord bot used to distribute news across discord.
 * Copyright (C) 2019-2021 MrAugu <mraugu@yahoo.com>
 * 
 * This plugin is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * GrowCord Plugin is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MARCHABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * @plugin
 * @name GrowCord Plugin
 * @version 1.0.0
 * @author MrAugu#7917 <mraugu@yahoo.com>
 * @description This plugin will allow you to view latest events to help you chose the items you need.
 * @endplugin
*/
var apiBase = "https://growcord.modcord.com/api";

(function () {
  console.log("%cLoading GrowCord Plugin...", "color: white; font-family: system-ui; font-size: 1.2rem; -webkit-text-stroke: 1px black; font-weight: bold");
  loadPlugin().then(() => {
    console.log("%cLoaded GrowCord plugin.", "color: white; font-family: system-ui; font-size: 1.2rem; -webkit-text-stroke: 1px black; font-weight: bold"); 
  });

  async function loadPlugin () {
    if (window.location.pathname !== "/") return;
    $.get(`${apiBase}/news`).done(function (newsItemList) {
      const warps = $("div.gsWrap");
      if (!warps[1]) return;
      let content = "";
      content += "<div class='gsWrap'>";
      content += "<div class='titleBar2' style='margin-bottom: 10px; margin-top: 5px;'>";
      content += "<h2>Today's News <span style='font-size: 0.7em'>(<a target='_blank' href='https://discord.com/api/oauth2/authorize?client_id=678010821238063105&permissions=8&scope=bot%20applications.commands' title='Powered by GrowCord' style='color: #45b6fe;' nofollow>Get GrowCord</a>)</h2>";
      content += "</div>";
  
      for (const newsItem of newsItemList) {
        content += "<div class='dqRes'>";
        content += "<div class='itemChipHead'>";
        if (newsItem.icon) {
          content += `<img src="https://cdn.discordapp.com/emojis/${newsItem.icon}.png?v=1" alt=${newsItem.title}>`;
        }
        content += "<div class='textWrap'>";
        content += `<h2>${newsItem.title}</h2>`
        content += "<br>";
        content += `<p>${newsItem.description}</p>`
        content += "</div>";
        content += "</div>";
        content += "</div>";
      }
      content += "</div>";
      $(content).insertBefore(warps[1]);
    });
  }
}());