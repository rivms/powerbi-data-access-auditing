/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
'use strict';

import './../style/visual.less';
import powerbi from 'powerbi-visuals-api';
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import { VisualSettings } from './settings';
import { CreateGrid } from './json-grid';
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;

import IVisualHost = powerbi.extensibility.IVisualHost;
import * as d3 from 'd3';
type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

export class Visual implements IVisual {
  private visualSettings: VisualSettings;
  private VisualName = 'AuditableGrid';
  private div: Selection<HTMLDivElement>;
  private gridVisual?: void;

  constructor(options: VisualConstructorOptions) {
    console.log(options);
    this.div = d3.select(options.element).append('div').classed('DataDiv', true).attr('id', this.VisualName);
  }

  public update(options: VisualUpdateOptions) {
    if (!options.dataViews || 0 === options.dataViews.length || !options.dataViews[0].table) {
      return;
    }
    console.log(options);

    let dataView: DataView = options.dataViews[0];
    this.visualSettings = VisualSettings.parse<VisualSettings>(dataView);
    let flag = false;
    for (let i = 0; i < dataView.table.columns.length; i++) {
      if (dataView.table.columns[i].roles.hasOwnProperty('Values')) {
        flag = true;
        break;
      }
    }
    d3.selectAll('#htmlChunk').remove();
    if (!flag) {
      this.div.selectAll('*').remove();
      const htmlChunk: string = 'Please select Values';
      d3.select('.DataDiv').style('overflow', 'visible');
      d3.select('.DataDiv')
        .append('div')
        .attr('id', 'htmlChunk')
        .style('margin-top', `${options.viewport.height / 2}px`)
        .style('margin-left', `10px`)
        .style('text-align', 'center')
        .style('font-size', `20px`)
        .text(htmlChunk);

      return;
    }
    d3.select('.DataDiv').style('overflow', 'auto');
    try {
      this.gridVisual = CreateGrid(this.VisualName, dataView, this.visualSettings.gridConfiguration);
    } catch (e) {
      console.error(e);
    }
  }

  // public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
  //   const settings: VisualSettings = this.visualSettings || <VisualSettings>VisualSettings.getDefault();
  //   return VisualSettings.enumerateObjectInstances(settings, options);
  // }
}
