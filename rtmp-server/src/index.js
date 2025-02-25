// @ts-check
//
//  Created by Aaqib khan on 2/25/2025.
//  Aaqib99
//  Copyright (c) 2024 NodeMedia. All rights reserved.
//

const logger = require("./core/logger.js");
const Package = require("../package.json");
const Context = require("./core/context.js");
const NodeHttpServer = require("./server/http_server.js");
const NodeRtmpServer = require("./server/rtmp_server.js");

class NodeMediaServer {
  constructor(config) {
    logger.level = "debug";
    logger.info(`Node-Media-Server v${Package.version}`);
    logger.info(`Homepage: ${Package.homepage}`);
    logger.info(`License: ${Package.license}`);
    logger.info(`Author: ${Package.author}`);

    this.ctx = new Context(config);
    this.httpServer = new NodeHttpServer(this.ctx);
    this.rtmpServer = new NodeRtmpServer(this.ctx);
  }

  run() {

    this.httpServer.run();
    this.rtmpServer.run();
    
  }
}

module.exports = NodeMediaServer;
