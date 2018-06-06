import { Injectable } from '@angular/core';

//Mis imports
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { RutaBaseService } from '../../ruta-base/ruta-base.service';

import { Observable } from "rxjs/Observable";
import { Subject } from 'rxjs/Subject';

export class Blog {
	id: number;
	tema: string;
	creador: string;
	created_at: number | string;
	updated_at: number | string;
	count_msgs: number;
}

@Injectable()
export class ListaService {

	private blogs: Blog[];

	private blogs$: Subject<Blog[]> = new Subject<Blog[]>();

  constructor(private http: HttpClient,
              private rutaService: RutaBaseService) { 
  	console.log('Hello ListaService');
  	this.blogs = [];
  }

	getBlogs$(): Observable<Blog[]> {
		return this.blogs$.asObservable();
	}

	agregarBlog(blog: Blog) {
		this.blogs.push(blog);
		this.blogs$.next(this.blogs);
	}

	getBlogs() {
		return this.blogs;
	}

	resetBlogs() {
		this.blogs = [];
	}

	deleteBlog(blog_id){
		var aux = this.blogs;

		this.blogs = [];

		for (var i = 0; i < aux.length; ++i) {
			if (blog_id != aux[i].id) {
				this.blogs.push(aux[i]);
			}
		}

		this.blogs$.next(this.blogs);

	}

	updateCount(blog_id){

		for (var i = 0; i < this.blogs.length; ++i) {
			if (blog_id == this.blogs[i].id) {
				this.blogs[i].count_msgs = this.blogs[i].count_msgs + 1;
			}
		}

	}

}
