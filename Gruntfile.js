module.exports = function(grunt) {
  grunt.initConfig({
    src: '.',
    dst: '.',
    pkg: grunt.file.readJSON('package.json'),

    less: {
      files: {
        expand: true,
        cwd: '<%=src%>',
        src: ['*.less'],
        dest: '<%=src%>',
        ext: '.css'
      }
    },

    watch: {
      less: {
        files: ['<%=src%>'],
        tasks: ['less']
      }
    }
  });

  var ref = ['grunt-contrib-less', 'grunt-contrib-watch'];
  for (var i = 0, len = ref.length; i < len; i++) {
    grunt.loadNpmTasks(ref[i]);
  }
  grunt.registerTask('dev', ['less']);
  grunt.registerTask('watchChanges', ['watch']);
  return grunt.registerTask('default', ['dev']);
};