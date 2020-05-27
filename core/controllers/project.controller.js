'use strict'

var Project = require('../models/project.model');
var fs = require('fs');
var path = require('path');
var controller = {

    saveProject: (req, res) => {
       var project = new Project();
       let params = req.body;
       project.name = params.name;
       project.description = params.description;
       project.category = params.category;
       project.year = params.year;
       project.langs = params.langs;
       project.image = null;

       project.save((err, projectStored) => {
          if(err) return res.status(500).send({message: 'Error al guardar.'});
          if (!projectStored) return res.status(404).send({message: 'No se ha podido guardar el proyecto'});

          return res.status(200).send({project: projectStored});
       });
    },
    getProject: (req, res) => {
      let projectId = req.params.id;

      if (projectId == null) return res.status(404).send({message: 'El proyecto no existe.'});

      Project.findById(projectId, (err, project) => {
        if (err) return res.status(500).send({message: 'Error al devolver los datos.'});
        if (!project) return res.status(404).send({message: 'El proyecto no existe.'});

        return res.status(200).send({project});
      });
    },

    getProjects: (req, res) => {
      Project.find({}).sort('-year').exec((err, projects) => {
        if (err) return res.status(500).send({message: 'Error al devolver los datos'});
        if (!projects) return res.status(404).send({message: 'No hay datos'});

        return res.status(200).send({projects});
      });
    },
    updateProject: (req, res) => {
      let projectId = req.params.id;
      let update = req.body;

      Project.findByIdAndUpdate(projectId, update, {new:true}, (err, projectUpdated) => {
        if (err) return res.status(500).send({message: 'Error al actualizar.'});
        if (!projectUpdated) return res.status(404).send({message: 'No se ha podido actualizar el proyecto.'});

        return res.status(200).send({project: projectUpdated});
      });
    },
    deleteProject: (req, res) => {
      let projectId = req.params.id;

      Project.findByIdAndDelete(projectId, (err, projectDeleted) => {
        if (err) return res.status(500).send({message: 'Proyecto no eliminado.'});
        if (!projectDeleted) return res.status(404).send({message: 'No se pudo eliminar este proyecto.'});

        return res.status(200).send({project: projectDeleted});
      });
    },
    uploadImage: (req, res) => {
      let projectId = req.params.id;
      var fileName = 'Imagen so subida.';

      if (req.files) {
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[1];
        var extSplit = fileName.split('.');
        var fileExt = extSplit[1];

        if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {

          Project.findByIdAndUpdate(projectId, {image: fileName}, {new:true}, (err, projectUpdated) => {
            if (err) return res.status(500).send({message: 'La imagen no se ha subido'});
            if (!projectUpdated) return res.status(404).send({message: 'El proyecto no existe.'});
  
            return res.status(200).send({project: projectUpdated});
          });

        } else {
          fs.unlink(filePath, (err) => {
            return res.status(200).send({message: 'La extension no es valida'});
          });
        }

      } else {
        res.status(500).send({message: fileName});
      }
    },
    getImageFile: (req, res) => {
      var file = req.params.image;
      var path_file = './uploads/' + file;

      fs.exists(path_file, (exists) => {
        if (exists) {
          return res.sendFile(path.resolve(path_file));
        } else {
          return res.status(200).send({message: 'No existe la imagen'});
        }
      })
    }

};
module.exports = controller;