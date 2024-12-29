"use client";
import * as pdfjs from "pdfjs-dist";

if (typeof Promise.withResolvers === "undefined") {
	if (window)
		// @ts-expect-error This does not exist outside of polyfill which this is doing
		window.Promise.withResolvers = function () {
			let resolve, reject;
			const promise = new Promise((res, rej) => {
				resolve = res;
				reject = rej;
			});
			return { promise, resolve, reject };
		};
	if (globalThis) {
		// @ts-expect-error This does not exist outside of polyfill which this is doing
		globalThis.Promise.withResolvers = function () {
			let resolve, reject;
			const promise = new Promise((res, rej) => {
				resolve = res;
				reject = rej;
			});
			return { promise, resolve, reject };
		};
	}
	if (global) {
		// @ts-expect-error This does not exist outside of polyfill which this is doing
		global.Promise.withResolvers = function () {
			let resolve, reject;
			const promise = new Promise((res, rej) => {
				resolve = res;
				reject = rej;
			});
			return { promise, resolve, reject };
		};
	}
}

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const PdfjsProvider = () => {
	return <></>;
};
