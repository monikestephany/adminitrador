function gerarElaborarEscala(id){
	
var boxGerarEscala = '<div class="wrap-gerarEscala">\
<div class="box-gerarEscala" id="gerarEscala'+id+'">\
				<div class="box-wrapEscala">\
				\
				<ul class="listTags">\
					<li class="addTag"><button>+</button></li>\
				</ul>\
				<ul class="listViaturas">\
					<li>VTR-001</li>\
					<li>VTR-002</li>\
					<li>VTR-003</li>\
					<li>VTR-004</li>\
					<li>VTR-005</li>\
				</ul>\
				<div class="listCPP">\
			<select class="selectCPP" multiple><option>teste</option></select>\
					<button class="pinthis">pin</button>\
				</div>\
				\
				<div class="box-PMs">\
					<ul class="listPMs">\
						<li class="incluir"></li>\
						<li class="atividade">Atividade</li>\
						<li class="funcao">Função</li>\
						<li class="pm">Policial</li>\
						<li class="mexp">Meio Expediente</li>\
						<li class="obs">OBS</li>\
					</ul>\
					\
					<ul class="listPMs " id="id1">\
						<li class="incluir"><button class="btn incluir" name="'+id+'">INCLUIR</button></li>\
						<li class="atividade"><select class="selectAtividade" multiple><option>ATIVIDADE 1</option><option>ATIVIDADE 2</option><option>ATIVIDADE 3</option></select></li>\
						<li class="funcao">Chefe</li>\
						<li class="pm">SD PM - 1C 930476 FERNANDES NASCIMENTO</li>\
						<li class="mexp">\
							<select class="textMeioExpediente">\
								<option>Dom</option>\
								<option>Seg</option>\
								<option>Ter</option>\
								<option>Qua</option>\
								<option>Qui</option>\
								<option>Sex</option>\
								<option>Sáb</option>\
							</select>\
							<select class="textMeioExpediente">\
								<option>08:00 - 10:30</option>\
								<option>09:00 - 11:30</option>\
								<option>12:00 - 18:00</option>\
								<option>18:30 - 00:30</option>\
							</select>\
						</li>\
						<li class="obs"><input type="text" class="textOBS"></li>\
					</ul>\
					<ul class="listPMs" id="id2">\
						<li class="incluir"><button class="btn incluir" name="'+id+'">INCLUIR</button></li>\
						<li class="atividade"><select class="selectAtividade" multiple><option>ATIVIDADE 1</option><option>ATIVIDADE 2</option><option>ATIVIDADE 3</option></select></li>\
						<li class="funcao">Chefe</li>\
						<li class="pm">Posto/Grad.+ RE + NOME 2</li>\
						<li class="mexp">\
							<select class="textMeioExpediente">\
								<option>Dom</option>\
								<option>Seg</option>\
								<option>Ter</option>\
								<option>Qua</option>\
								<option>Qui</option>\
								<option>Sex</option>\
								<option>Sáb</option>\
							</select>\
							<select class="textMeioExpediente">\
								<option>08:00 - 10:30</option>\
								<option>09:00 - 11:30</option>\
								<option>12:00 - 18:00</option>\
								<option>18:30 - 00:30</option>\
							</select>\
						</li>\
						<li class="obs"><input type="text" class="textOBS"></li>\
					</ul>\
					<ul class="listPMs" id="id3">\
						<li class="incluir"><button class="btn incluir" name="'+id+'">INCLUIR</button></li>\
						<li class="atividade"><select class="selectAtividade" multiple><option>ATIVIDADE 1</option><option>ATIVIDADE 2</option><option>ATIVIDADE 3</option></select></li>\
						<li class="funcao">Chefe</li>\
						<li class="pm">Posto/Grad.+ RE + NOME 3</li>\
						<li class="mexp">\
							<select class="textMeioExpediente">\
								<option>Dom</option>\
								<option>Seg</option>\
								<option>Ter</option>\
								<option>Qua</option>\
								<option>Qui</option>\
								<option>Sex</option>\
								<option>Sáb</option>\
							</select>\
							<select class="textMeioExpediente">\
								<option>08:00 - 10:30</option>\
								<option>09:00 - 11:30</option>\
								<option>12:00 - 18:00</option>\
								<option>18:30 - 00:30</option>\
							</select>\
						</li>\
						<li class="obs"><input type="text" class="textOBS"></li>\
					</ul>\
					<ul class="listPMs warning" id="id4">\
						<li class="incluir"><button class="btn incluir" name="'+id+'">INCLUIR</button></li>\
						<li class="atividade"><select class="selectAtividade" multiple><option>ATIVIDADE 1</option><option>ATIVIDADE 2</option><option>ATIVIDADE 3</option></select></li>\
						<li class="funcao">Chefe</li>\
						<li class="pm">Posto/Grad.+ RE + NOME 4</li>\
						<li class="mexp">\
							<select class="textMeioExpediente">\
								<option>Dom</option>\
								<option>Seg</option>\
								<option>Ter</option>\
								<option>Qua</option>\
								<option>Qui</option>\
								<option>Sex</option>\
								<option>Sáb</option>\
							</select>\
							<select class="textMeioExpediente">\
								<option>08:00 - 10:30</option>\
								<option>09:00 - 11:30</option>\
								<option>12:00 - 18:00</option>\
								<option>18:30 - 00:30</option>\
							</select>\
						</li>\
						<li class="obs"><input type="text" class="textOBS"></li>\
					</ul>\
					<ul class="listPMs warningRed" id="id5">	\
						<li class="incluir"><button class="btn incluir" name="'+id+'">INCLUIR</button></li>\
						<li class="atividade"><select class="selectAtividade" multiple><option>ATIVIDADE 1</option><option>ATIVIDADE 2</option><option>ATIVIDADE 3</option></select></li>\
						<li class="funcao">Chefe</li>\
						<li class="pm">Posto/Grad.+ RE + NOME 5</li>\
						<li class="mexp">\
							<select class="textMeioExpediente">\
								<option>Dom</option>\
								<option>Seg</option>\
								<option>Ter</option>\
								<option>Qua</option>\
								<option>Qui</option>\
								<option>Sex</option>\
								<option>Sáb</option>\
							</select>\
							<select class="textMeioExpediente">\
								<option>08:00 - 10:30</option>\
								<option>09:00 - 11:30</option>\
								<option>12:00 - 18:00</option>\
								<option>18:30 - 00:30</option>\
							</select>\
						</li>\
						<li class="obs"><input type="text" class="textOBS"></li>\
					</ul>\
\
					\
				</div>\
				</div>\
			</div>\
			<div class="box-escalaResultado" id="escalaResultado'+id+'">\
				</div>\
				</div>';

	$('.wrap-templateResult').append(boxGerarEscala);
}