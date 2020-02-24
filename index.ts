// Import stylesheets
import './style.css';

import {map, reduce, forEach, entries} from 'lodash';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `
	<div class="slideout__content rearrange-positions">
		<div class="rearrange-positions__filter"></div>
		<div class="rearrange-positions__control">
      <div class="rearrange_control">
        <button class="rearrange-control__button">Top</button>
        <button class="rearrange-control__button">Up</button>
        <button class="rearrange-control__button">Down</button>
        <button class="rearrange-control__button">Bottom</button>
      </div>
		</div>
				<div class="rearrange-positions__list">
          <ul class="pe-simple-slats">
            <li class="pe-simple-slats__slat">
              tabindex="0"
              <ul class="pe-simple-slats__tabular">
                <li class="pe-simple-slats__tabularrow">
                  <div class="pe-simple-slats__tabularlabel">Label 1</div>
                  <div class="pe-simple-slats__tabularvalue">Value 1</div>
                </li>
              </ul>
            </li>
          </ul>
				</div>
			</div>
`;
